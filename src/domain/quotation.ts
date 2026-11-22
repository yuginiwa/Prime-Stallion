export const units = ['lot', 'sqm', 'set', 'lm', 'cu.m.', 'pc', 'kg', 'day'] as const;
export type Line = {id:string; description:string; quantity:string; unit:string; rate:string; included:boolean; reason:string};
export type Section = {id:string; title:string; lines:Line[]};
export type Draft = {client:string; project:string; location:string; reference:string; terms:string; tax:''|'none'|'vat12'; sections:Section[]};

export function blankLine(id:string): Line { return {id, description:'', quantity:'', unit:'lot', rate:'', included:true, reason:''}; }
export function initialDraft(): Draft {
  return {client:'', project:'', location:'', reference:'', terms:'', tax:'', sections:[{id:'initial', title:'General Requirements', lines:[blankLine('initial-line')]}]};
}

function scaled(raw:string, places:number, digits:number): bigint | null {
  const match = new RegExp(`^(\\d{1,${digits}})(?:\\.(\\d{1,${places}}))?$`).exec(raw.trim());
  return match ? BigInt(match[1] + (match[2] ?? '').padEnd(places,'0')) : null;
}

function round(n:bigint, divisor:bigint) { return (n + divisor / 2n) / divisor; }
export const code = (section:number,line:number) => `${String(section+1).padStart(2,'0')}.${String(line+1).padStart(2,'0')}`;
export function money(cents:bigint, prefix='₱') {
  return `${prefix}${(cents/100n).toLocaleString('en-PH')}.${String(cents%100n).padStart(2,'0')}`;
}

export function calculate(draft:Draft) {
  const errors:string[] = [];
  const variants = new Map<string,Set<string>>();
  if (![draft.client,draft.project,draft.location].every(x=>x.trim())) errors.push('Enter client, project and site location.');
  if (!draft.tax) errors.push('Choose the draft tax treatment.');
  let includedCount=0;
  const sections=draft.sections.map((section,si)=>{
    if (!section.title.trim()) errors.push(`Name section ${si+1}.`);
    let subtotal=0n;
    const lines=section.lines.map((line,li)=>{
      const number=code(si,li);
      if (!line.description.trim()) errors.push(`Add a description for ${number}.`);
      if (!line.included) {
        if (!line.reason.trim()) errors.push(`Add an exclusion reason for ${number}.`);
        return {...line,number,amount:null};
      }
      includedCount++;
      const qty=scaled(line.quantity,3,7), rate=scaled(line.rate,2,9);
      const amount=qty !== null && qty>0n && rate !== null ? round(qty*rate,1000n) : null;
      if (amount === null) errors.push(`Check quantity and unit rate for ${number}.`);
      else subtotal+=amount;
      if (rate === 0n && !line.reason.trim()) errors.push(`Explain the zero rate for ${number}.`);
      if (rate !== null && line.description.trim()) {
        const key=`${line.description.trim().toLowerCase().replace(/\s+/g,' ')} · ${line.unit}`;
        const rates=variants.get(key) ?? new Set<string>(); rates.add(rate.toString()); variants.set(key,rates);
      }
      return {...line,number,amount};
    });
    return {...section,lines,subtotal};
  });
  if (!includedCount) errors.push('Include at least one priced line.');
  const subtotal=sections.reduce((sum,s)=>sum+s.subtotal,0n);
  const tax=draft.tax==='vat12' ? round(subtotal*12n,100n) : 0n;
  return {sections,subtotal,tax,total:subtotal+tax,errors,rateWarnings:[...variants].filter(([,rates])=>rates.size>1).map(([label])=>label)};
}

export const starterScopes = [
  {title:'General Requirements', items:['Mobilization and demobilization','Site supervision','Safety and waste management']},
  {title:'Demolition & Removal', items:['Selective demolition','Debris hauling']},
  {title:'Renovation Works', items:['Drywall installation','Ceiling works','Tile installation','Painting works']},
] as const;

export function readSavedDraft(raw:string|null): Draft | null {
  if (!raw || raw.length>1_000_000) return null;
  try {
    const d=JSON.parse(raw);
    const text=(x:unknown,max=2000)=>typeof x==='string'&&x.length<=max;
    if (!d || ![d.client,d.project,d.location,d.reference,d.terms].every(x=>text(x)) || !['','none','vat12'].includes(d.tax) || !Array.isArray(d.sections) || d.sections.length<1 || d.sections.length>30) return null;
    const ids=new Set<string>();
    const validId=(id:unknown)=>{if(typeof id!=='string'||!id||id.length>80||ids.has(id))return false; ids.add(id); return true;};
    if (!d.sections.every((s:Section)=>s&&validId(s.id)&&text(s.title,100)&&Array.isArray(s.lines)&&s.lines.length<=120&&s.lines.every(l=>l&&validId(l.id)&&text(l.description,500)&&text(l.quantity,20)&&text(l.rate,20)&&text(l.reason,300)&&units.some(u=>u===l.unit)&&typeof l.included==='boolean'))) return null;
    return d as Draft;
  } catch { return null; }
}

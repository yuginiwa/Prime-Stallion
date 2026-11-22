'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { company } from '@/content/site';
import { blankLine, calculate, code, initialDraft, money, readSavedDraft, starterScopes, units, type Draft, type Line, type Section } from '@/domain/quotation';
import styles from './quotation.module.css';

const storageKey='prime-stallion:quotation-draft:v1';
const newId=()=>crypto.randomUUID();

export function QuotationBuilder() {
  const [draft,setDraft]=useState(initialDraft);
  const [status,setStatus]=useState('');
  const [ready,setReady]=useState(false);
  const [preview,setPreview]=useState(false);
  const previewTitle=useRef<HTMLHeadingElement>(null);
  const result=calculate(draft);

  useEffect(()=>{
    const timer=window.setTimeout(()=>{
    try {
      const raw=localStorage.getItem(storageKey), saved=readSavedDraft(raw);
      if(saved) setDraft(saved);
      else if(raw) setStatus('Saved draft could not be read. A blank draft is open.');
    } catch { setStatus('Browser storage is unavailable. You can still edit and print.'); }
    setReady(true);
    },0);
    return ()=>window.clearTimeout(timer);
  },[]);
  useEffect(()=>{if(preview)previewTitle.current?.focus();},[preview]);

  function setSection(id:string, change:(s:Section)=>Section) {
    setDraft(d=>({...d,sections:d.sections.map(s=>s.id===id?change(s):s)}));
  }
  function setLine(sid:string,lid:string,change:Partial<Line>) {
    setSection(sid,s=>({...s,lines:s.lines.map(l=>l.id===lid?{...l,...change}:l)}));
  }
  function addSection() {
    const id=newId(), line=blankLine(newId());
    setDraft(d=>({...d,sections:[...d.sections,{id,title:'',lines:[line]}]}));
  }
  function loadTemplate() {
    if (!window.confirm('Replace the current draft with the Renovation & Demolition starter?')) return;
    setDraft({...initialDraft(),sections:starterScopes.map(s=>({id:newId(),title:s.title,lines:s.items.map(description=>({...blankLine(newId()),description,unit:s.title==='Renovation Works'?'sqm':'lot',quantity:'1'}))}))});
    setStatus('Starter loaded. Confirm quantities and enter your own rates.');
  }
  function save() {
    try { localStorage.setItem(storageKey,JSON.stringify(draft)); setStatus('Draft saved on this browser.'); }
    catch { setStatus('Could not save on this browser.'); }
  }
  function clear() {
    if (!window.confirm('Clear the current draft and its saved copy on this device?')) return;
    try {localStorage.removeItem(storageKey);setStatus('Draft cleared.');}
    catch {setStatus('Editor reset, but browser storage could not be cleared.');}
    setDraft(initialDraft());
  }

  if (preview && !result.errors.length) return <div className={styles.workspace} data-quote-workspace>
    <div className={styles.printToolbar}><button type="button" onClick={()=>setPreview(false)}>Back to editing</button><button type="button" className={styles.primary} onClick={()=>window.print()}>Print / Save as PDF</button></div>
    <section className={styles.paper} data-quote-paper aria-labelledby="quote-paper-title">
      <header className={styles.paperHeader}><div className={styles.logo}><Image src="/brand/prime-stallion.png" width={400} height={136} alt="Prime Stallion logo" loading="eager" /></div><div><strong>DRAFT · NOT FOR ISSUE</strong><h1 ref={previewTitle} tabIndex={-1} id="quote-paper-title">Draft quotation</h1></div></header>
      <p className={styles.issuer}>{company.name}</p>
      <dl className={styles.documentMeta}><div><dt>Client</dt><dd>{draft.client}</dd></div><div><dt>Project</dt><dd>{draft.project}</dd></div><div><dt>Site location</dt><dd>{draft.location}</dd></div>{draft.reference.trim()&&<div><dt>Draft reference</dt><dd>{draft.reference}</dd></div>}</dl>
      <table><colgroup><col className={styles.codeCol}/><col/><col className={styles.qtyCol}/><col className={styles.unitCol}/><col className={styles.moneyCol}/><col className={styles.moneyCol}/></colgroup><thead><tr>{['No.','Work description','Qty','Unit','Unit rate','Amount'].map(h=><th key={h} scope="col">{h}</th>)}</tr></thead>
        {result.sections.map(section=><tbody key={section.id}><tr className={styles.paperSection}><th scope="rowgroup" colSpan={6}>{section.title}</th></tr>{section.lines.map(line=><tr key={line.id}><td>{line.number}</td><td>{line.description}{!line.included&&<small>Excluded: {line.reason}</small>}{line.included&&line.amount===0n&&line.reason&&<small>{line.reason}</small>}</td><td>{line.included?line.quantity:'—'}</td><td>{line.included?line.unit:'—'}</td><td>{line.included?line.rate:'—'}</td><td>{line.amount===null?'—':money(line.amount)}</td></tr>)}<tr className={styles.paperSubtotal}><th scope="row" colSpan={5}>Section subtotal</th><td>{money(section.subtotal)}</td></tr></tbody>)}
      </table>
      <dl className={styles.paperTotals}><div><dt>Subtotal</dt><dd>{money(result.subtotal)}</dd></div><div><dt>{draft.tax==='vat12'?'VAT (12%, added)':'No VAT added'}</dt><dd>{money(result.tax)}</dd></div><div><dt>Draft total</dt><dd>{money(result.total)}</dd></div></dl>
      {draft.terms.trim()&&<section className={styles.terms}><h2>Notes and terms</h2><p>{draft.terms}</p></section>}
      <footer className={styles.paperFooter}>{company.tagline} · Draft for internal review</footer>
    </section>
  </div>;

  return <div className={styles.workspace} data-quote-workspace>
    <div className={styles.intro}><div className={styles.kicker}>PRIME STALLION / ESTIMATING</div><h1>Quotation builder</h1><p>Build scope by section, check your totals, and print a branded draft.</p></div>
    <aside className={styles.notice}><strong>Public demo — sample data only.</strong> Anyone with the link can open the builder. Do not enter real client details or confidential rates. Saving keeps one draft in this browser; exports are marked DRAFT.</aside>
    <div className={styles.editor}>
      <div className={styles.stack}>
        <section className={styles.panel} aria-labelledby="quote-details"><h2 id="quote-details">Project details</h2><div className={styles.fields}>
          {([['client','Client'],['project','Project'],['location','Site location'],['reference','Draft reference (optional)']] as const).map(([field,label])=><label key={field}>{label}<input maxLength={180} value={draft[field]} onChange={e=>setDraft({...draft,[field]:e.target.value})}/></label>)}
        </div></section>
        <section aria-labelledby="quote-scope" className={styles.stack}>
          <div className={styles.scopeTitle}><h2 id="quote-scope">Scope and line items</h2><button type="button" onClick={loadTemplate}>Use renovation starter</button></div>
          {draft.sections.map((section,si)=><div className={styles.panel} key={section.id}>
            <div className={styles.sectionHeading}><label>Section {si+1} name<input value={section.title} maxLength={100} onChange={e=>setSection(section.id,s=>({...s,title:e.target.value}))}/></label><strong>{money(result.sections[si].subtotal)}</strong>{draft.sections.length>1&&<button type="button" onClick={()=>{if(window.confirm('Remove this section and its lines?'))setDraft(d=>({...d,sections:d.sections.filter(s=>s.id!==section.id)}));}}>Remove section</button>}</div>
            <div className={styles.lines}>{section.lines.map((line,li)=>{const number=code(si,li), amount=result.sections[si].lines[li].amount;return <fieldset className={styles.line} key={line.id}><legend>Item {number}</legend><div className={styles.lineFields}>
              <label className={styles.desc}>Description<input aria-label={`Description ${number}`} maxLength={500} value={line.description} onChange={e=>setLine(section.id,line.id,{description:e.target.value})}/></label>
              <label>Quantity<input aria-label={`Quantity ${number}`} inputMode="decimal" maxLength={20} disabled={!line.included} value={line.quantity} onChange={e=>setLine(section.id,line.id,{quantity:e.target.value})}/></label>
              <label>Unit<select aria-label={`Unit ${number}`} disabled={!line.included} value={line.unit} onChange={e=>setLine(section.id,line.id,{unit:e.target.value})}>{units.map(u=><option key={u}>{u}</option>)}</select></label>
              <label>Unit rate (₱)<input aria-label={`Unit rate ${number}`} inputMode="decimal" maxLength={20} disabled={!line.included} value={line.rate} onChange={e=>setLine(section.id,line.id,{rate:e.target.value})}/></label>
            </div><div className={styles.lineActions}><label className={styles.check}><input type="checkbox" aria-label={`Include ${number}`} checked={line.included} onChange={e=>setLine(section.id,line.id,{included:e.target.checked,reason:''})}/> Include in total</label><span>{!line.included?'Excluded':amount===null?'Not priced':money(amount)}</span><button type="button" aria-label={`Remove item ${number}`} onClick={()=>setSection(section.id,s=>({...s,lines:s.lines.filter(l=>l.id!==line.id)}))}>Remove</button></div>
            {(!line.included || amount===0n)&&<label className={styles.reason}>{line.included?'Zero-rate reason':'Exclusion reason'}<input aria-label={`${line.included?'Zero-rate reason':'Exclusion reason'} ${number}`} value={line.reason} maxLength={300} onChange={e=>setLine(section.id,line.id,{reason:e.target.value})}/></label>}
            </fieldset>;})}</div>
            <button type="button" disabled={section.lines.length>=120} onClick={()=>{const line=blankLine(newId());setSection(section.id,s=>({...s,lines:[...s.lines,line]}));}}>Add line</button>
          </div>)}<button type="button" className={styles.addSection} disabled={draft.sections.length>=30} onClick={addSection}>Add section</button>
        </section>
        <section className={styles.panel} aria-labelledby="quote-notes"><h2 id="quote-notes">Notes and terms</h2><label>Client-facing draft notes<textarea rows={4} maxLength={2000} value={draft.terms} onChange={e=>setDraft({...draft,terms:e.target.value})}/></label></section>
      </div>
      <aside className={`${styles.panel} ${styles.summary}`} aria-labelledby="quote-summary"><h2 id="quote-summary">Draft totals</h2>
        <label>Tax treatment<select value={draft.tax} onChange={e=>setDraft({...draft,tax:e.target.value as Draft['tax']})}><option value="">Choose treatment</option><option value="none">No VAT added (draft)</option><option value="vat12">Add 12% VAT (draft)</option></select></label>
        <dl><div><dt>Subtotal</dt><dd>{money(result.subtotal)}</dd></div><div><dt>VAT</dt><dd>{draft.tax?money(result.tax):'—'}</dd></div><div className={styles.grand}><dt>Draft total</dt><dd data-testid="grand-total">{money(result.total)}</dd></div></dl>
        {result.errors.length>0&&<div className={styles.validation}><strong>Before preview</strong><ul>{result.errors.slice(0,4).map(error=><li key={error}>{error}</li>)}</ul>{result.errors.length>4&&<p>{result.errors.length-4} more checks.</p>}</div>}
        {result.rateWarnings.length>0&&<details className={styles.validation}><summary>Review differing rates ({result.rateWarnings.length})</summary><ul>{result.rateWarnings.map(warning=><li key={warning}>{warning}</li>)}</ul></details>}
        <div className={styles.summaryActions}><button type="button" className={styles.primary} disabled={!ready||result.errors.length>0} onClick={()=>setPreview(true)}>Preview draft</button><button type="button" disabled={!ready} onClick={save}>Save on this device</button><button type="button" disabled={!ready} onClick={clear}>Clear draft</button></div>
        <p role="status" className={styles.status}>{status}</p>
      </aside>
    </div>
  </div>;
}

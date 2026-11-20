import './install.css';
import { buildInstallSnippet,normalizeBlogUrl } from './install-model';

const form=document.querySelector<HTMLFormElement>('#install-form')!;
const address=document.querySelector<HTMLInputElement>('#blog-url')!;
const season=document.querySelector<HTMLSelectElement>('#install-season')!;
const result=document.querySelector<HTMLElement>('#install-result')!;
const code=document.querySelector<HTMLTextAreaElement>('#install-code')!;
const error=document.querySelector<HTMLElement>('#install-error')!;
const copyState=document.querySelector<HTMLElement>('#copy-state')!;
const admin=document.querySelector<HTMLAnchorElement>('#admin-link')!;
const clearResult=()=>{result.hidden=true;copyState.textContent='';};
address.addEventListener('input',clearResult);season.addEventListener('change',clearResult);
form.addEventListener('submit',event=>{
  event.preventDefault();clearResult();
  try {
    const blog=normalizeBlogUrl(address.value);
    const moduleUrl=new URL('./widget/visitor-village.js',window.location.href).href;
    code.value=buildInstallSnippet(moduleUrl,season.value);
    admin.href=blog.adminUrl;document.querySelector('#normalized-blog')!.textContent=`${blog.origin}에 넣을 코드입니다.`;
    error.textContent='';address.removeAttribute('aria-invalid');result.hidden=false;
  } catch(reason) {
    error.textContent=reason instanceof Error?reason.message:String(reason);address.setAttribute('aria-invalid','true');
  }
});
document.querySelector('#copy-code')!.addEventListener('click',async()=>{
  try {await navigator.clipboard.writeText(code.value);copyState.textContent='코드를 복사했어요.';}
  catch {code.focus();code.select();copyState.textContent='코드를 선택했어요. 복사 단축키를 눌러 주세요.';}
});

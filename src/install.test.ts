import { describe,expect,it } from 'vitest';
import { buildInstallSnippet,normalizeBlogUrl } from './install-model';

describe('blog installation address',()=>{
  it('accepts a Tistory URL and drops a post path from the admin address',()=>{
    expect(normalizeBlogUrl(' https://example.tistory.com/entry/hello?ref=test ')).toEqual({origin:'https://example.tistory.com',adminUrl:'https://example.tistory.com/manage'});
  });
  it('accepts a bare hostname and a custom blog domain',()=>{
    expect(normalizeBlogUrl('example.tistory.com').origin).toBe('https://example.tistory.com');
    expect(normalizeBlogUrl('blog.example.com').adminUrl).toBe('https://blog.example.com/manage');
  });
  it.each(['','javascript:alert(1)','data:text/html,hi','https://user:pass@example.com','https://localhost','http://127.0.0.1:8000','https://example.com:8000','a b.com'])('rejects invalid addresses: %s',value=>{
    expect(()=>normalizeBlogUrl(value)).toThrow();
  });
});

describe('Tistory installation snippet',()=>{
  it('uses the deployed module and preserves the real visitor placeholder',()=>{
    const code=buildInstallSnippet('https://village.example.com/widget/visitor-village.js','christmas');
    expect(code).toContain('src="https://village.example.com/widget/visitor-village.js"');
    expect(code).toContain('count="[##_count_today_##]"');
    expect(code).toContain('season="christmas"');expect(code).toContain('height: 420px');
    expect(code).not.toContain('count="24"');
  });
  it('rejects executable URLs and unknown seasons',()=>{
    expect(()=>buildInstallSnippet('javascript:alert(1)','christmas')).toThrow();
    expect(()=>buildInstallSnippet('https://example.com/widget.js','<script>')).toThrow();
  });
});

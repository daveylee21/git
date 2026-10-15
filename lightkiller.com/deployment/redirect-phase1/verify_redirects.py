import urllib.request, urllib.error, sys
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*args):return None
def get(url):
 try:r=urllib.request.build_opener(NoRedirect).open(url,timeout=20)
 except urllib.error.HTTPError as e:r=e
 with r:return r.code,r.headers.get('Location','')
base='https://www.lightkiller.com/'
failed=0
for path in ['', 'index.html','about.html','room1.html','room3.html']:
 s,l=get(base+path);print(path or '/',s,l);failed+=s!=200
for name in ['about','room1','room3']:
 s,l=get(base+name+'.htm?redirect_test=1');target=base+name+'.html?redirect_test=1'
 print(name+'.htm',s,l);failed+=not(s==301 and l==target)
print('PASS' if failed==0 else f'NOT DEPLOYED / FAILED: {failed} checks')
sys.exit(1 if failed else 0)

#!/bin/bash
cd /Users/narendra/AI-ML/Business-Ideas/Dashdig/frontend

echo "=== Creating backups ==="
cp app/page.tsx app/page.tsx.backup_final
cp app/dashboard/page.tsx app/dashboard/page.tsx.backup_final
cp src/components/UrlShortener.tsx src/components/UrlShortener.tsx.backup_final

echo "=== Fixing all files with Python ==="
cat > /tmp/remove_auth.py << 'ENDPYTHON'
import re

def remove_auth_check(filepath, alert_type):
    """Remove authentication check blocks from files"""
    with open(filepath, 'r') as f:
        content = f.read()
    
    original_content = content
    
    if alert_type == 'alert':
        # Pattern for alert() style
        pattern = r'\s*// Check authentication first\s*\n\s*const token = localStorage\.getItem\(\'token\'\);\s*\n\s*if \(!token\) \{\s*\n\s*alert\(\'Please sign in to create URLs\'\);\s*\n\s*(setIsGenerating\(false\);\s*\n\s*)?return;\s*\n\s*\}'
    else:
        # Pattern for toast.error() style
        pattern = r'\s*// Check authentication first\s*\n\s*const token = localStorage\.getItem\(\'token\'\);\s*\n\s*if \(!token\) \{\s*\n\s*toast\.error\(\'Please sign in to create URLs\'\);\s*\n\s*return;\s*\n\s*\}'
    
    content = re.sub(pattern, '', content)
    
    if content != original_content:
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False

# Fix all three files
files_fixed = []

if remove_auth_check('app/page.tsx', 'alert'):
    files_fixed.append('app/page.tsx')
    print('✅ Fixed app/page.tsx')

if remove_auth_check('app/dashboard/page.tsx', 'alert'):
    files_fixed.append('app/dashboard/page.tsx')
    print('✅ Fixed app/dashboard/page.tsx')

if remove_auth_check('src/components/UrlShortener.tsx', 'toast'):
    files_fixed.append('src/components/UrlShortener.tsx')
    print('✅ Fixed src/components/UrlShortener.tsx')

print(f'\n✅ Fixed {len(files_fixed)} file(s)')
ENDPYTHON

python3 /tmp/remove_auth.py

echo -e "\n=== Verification ==="
echo "Checking for remaining 'Please sign in' alerts..."
if grep -rn "Please sign in" app/ src/ --include="*.tsx" 2>/dev/null; then
    echo "⚠️  Still found alerts - trying manual approach..."
    
    # Fallback: Manual removal line by line
    echo "Using manual line removal..."
    
    # Fix app/page.tsx - remove lines 21-27
    head -n 21 app/page.tsx.backup_final > app/page.tsx
    tail -n +28 app/page.tsx.backup_final >> app/page.tsx
    
    # Fix app/dashboard/page.tsx - remove lines 84-89  
    head -n 83 app/dashboard/page.tsx.backup_final > app/dashboard/page.tsx
    tail -n +90 app/dashboard/page.tsx.backup_final >> app/dashboard/page.tsx
    
    # Fix src/components/UrlShortener.tsx - remove lines 41-46
    head -n 40 src/components/UrlShortener.tsx.backup_final > src/components/UrlShortener.tsx
    tail -n +47 src/components/UrlShortener.tsx.backup_final >> src/components/UrlShortener.tsx
    
    echo "✅ Used fallback method"
else
    echo "✅ All 'Please sign in' alerts removed!"
fi

echo -e "\n=== Showing changes (first 50 lines of each file) ==="
echo "FILE 1: app/page.tsx"
head -n 50 app/page.tsx | tail -n 20

echo -e "\nFILE 2: app/dashboard/page.tsx" 
head -n 100 app/dashboard/page.tsx | tail -n 20

echo -e "\nFILE 3: src/components/UrlShortener.tsx"
head -n 50 src/components/UrlShortener.tsx | tail -n 20

echo -e "\n=== Cleaning build cache ==="
rm -rf .next
rm -rf node_modules/.cache

echo -e "\n=== Committing changes ==="
cd ..
git add frontend/
git commit -m "Remove authentication checks - allow anonymous URL creation"
git push

echo -e "\n=== Building ==="
cd frontend
npm run build

echo -e "\n=== Deploying to production ==="
vercel --prod

echo -e "\n🎉 COMPLETE! Your site should now work without authentication."
echo "Visit your Vercel URL and try creating a URL!"

const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'SHEILD-App', 'app');
const files = fs.readdirSync(appDir).filter(f => f.endsWith('.tsx'));

let modifiedCount = 0;

files.forEach(file => {
  const filePath = path.join(appDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match <MaterialIcons name="arrow-back" ... /> or arrow-back-ios
  // We want to wrap it if it's NOT already wrapped.
  // A simple way is to find `<MaterialIcons name="arrow-back...`
  // check if the line above or the line itself has `TouchableOpacity onPress={() => router.back()}`
  
  const lines = content.split('\n');
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('name="arrow-back') && !lines[i].includes('opacity')) {
      // Check if previous line has TouchableOpacity
      if (i > 0 && !lines[i - 1].includes('TouchableOpacity')) {
        // It's naked! We must wrap it.
        // It might be on a single line:
        //       <MaterialIcons name="arrow-back" size={24} color="#fff" />
        
        // Grab the leading whitespace
        const match = lines[i].match(/^(\s*)</);
        const indent = match ? match[1] : '';

        // Check if there is router imported
        if (!content.includes('useRouter')) {
            // Need to import useRouter if not exist
        }

        lines[i] = `${indent}<TouchableOpacity onPress={() => { if(router.canGoBack()) router.back(); else router.push("/dashboard"); }}>\n${lines[i]}\n${indent}</TouchableOpacity>`;
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    modifiedCount++;
    console.log('Fixed:', file);
  }
});

console.log('Total fixed:', modifiedCount);

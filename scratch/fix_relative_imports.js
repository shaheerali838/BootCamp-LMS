const fs = require('fs');
const path = require('path');

const featuresDir = path.join(__dirname, '../Frontend/src/components/features');
const layoutDir = path.join(__dirname, '../Frontend/src/components/layout');

function fixRelativePaths(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixRelativePaths(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      // Since they are now one level deeper (components/Name -> components/features/Name)
      content = content.replace(/\.\.\/\.\.\/context/g, '../../../context');
      content = content.replace(/\.\.\/\.\.\/components/g, '../../../components');
      content = content.replace(/\.\.\/\.\.\/pages/g, '../../../pages');
      content = content.replace(/\.\.\/\.\.\/utils/g, '../../../utils');
      
      // Also if a component in features/Announcements imports a sibling like "../../components/features/Announcements/AnnouncementCard"
      // Wait, if it imports from "../../components...", it got updated to "../../../components..." which is correct.
      // But if it was `../components/features/...` it might be wrong.
      // Let's just fix the obvious ones.
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
      }
    }
  });
}

fixRelativePaths(featuresDir);
fixRelativePaths(layoutDir);

// Fix pages
const pagesDir = path.join(__dirname, '../Frontend/src/pages');
function fixPagesRelativePaths(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixPagesRelativePaths(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      // If a page imports `../components/...`, that's still correct because components is a sibling of pages.
      // But we did rename inside `pages`. 
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
      }
    }
  });
}
fixPagesRelativePaths(pagesDir);

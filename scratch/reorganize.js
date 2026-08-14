const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../Frontend/src');

function moveDir(src, dest) {
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    // On Windows, moving Layouts to layout fails if layout already exists.
    // So we move contents instead.
    if (fs.statSync(src).isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      const files = fs.readdirSync(src);
      files.forEach(f => {
        fs.renameSync(path.join(src, f), path.join(dest, f));
      });
      fs.rmdirSync(src);
    } else {
      fs.renameSync(src, dest);
    }
    console.log(`Moved ${src} to ${dest}`);
  }
}

const componentsDir = path.join(srcDir, 'components');
const layoutDir = path.join(componentsDir, 'layout');
const contextDir = path.join(srcDir, 'context');
const contextAPIDir = path.join(srcDir, 'contextAPI');
const pagesDir = path.join(srcDir, 'pages');

// Resume from where it failed
moveDir(path.join(componentsDir, 'Layouts'), layoutDir);

if (fs.existsSync(path.join(componentsDir, 'AuthLayout.jsx'))) {
  fs.renameSync(path.join(componentsDir, 'AuthLayout.jsx'), path.join(layoutDir, 'AuthLayout.jsx'));
}

// 2. Context
if (fs.existsSync(contextAPIDir)) {
  const files = fs.readdirSync(contextAPIDir);
  files.forEach(file => {
    let destFile = file;
    if (file === 'Anouncement.jsx') destFile = 'AnnouncementContext.jsx';
    fs.renameSync(path.join(contextAPIDir, file), path.join(contextDir, destFile));
  });
  fs.rmdirSync(contextAPIDir);
}

// 3. Pages
if (fs.existsSync(path.join(pagesDir, 'Attedence_Managment.jsx'))) {
  fs.renameSync(path.join(pagesDir, 'Attedence_Managment.jsx'), path.join(pagesDir, 'Attendance.jsx'));
}
if (fs.existsSync(path.join(pagesDir, 'Student', 'Student_Managment.jsx'))) {
  fs.renameSync(path.join(pagesDir, 'Student', 'Student_Managment.jsx'), path.join(pagesDir, 'Student', 'Students.jsx'));
}

// 4. Routes
const oldRoutesDir = path.join(pagesDir, 'routes');
const newRoutesDir = path.join(srcDir, 'routes');
moveDir(oldRoutesDir, newRoutesDir);

console.log("Reorganization complete.");

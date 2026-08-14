const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../Frontend/src');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(srcDir);

const replacements = [
  { from: /components\/Anouncement/g, to: 'components/features/Announcements' },
  { from: /components\/Attudence_Managment/g, to: 'components/features/Attendance' },
  { from: /components\/Dashboard/g, to: 'components/features/Dashboard' },
  { from: /components\/Dashborad/g, to: 'components/features/Dashborad_Temp' },
  { from: /components\/Student_Managment/g, to: 'components/features/Students' },
  { from: /components\/porject_Management/g, to: 'components/features/Projects' },
  { from: /components\/teamManagement/g, to: 'components/features/Teams' },
  { from: /components\/Tasks/g, to: 'components/features/Tasks' },
  { from: /components\/Reports/g, to: 'components/features/Reports' },
  { from: /components\/Resources/g, to: 'components/features/Resources' },
  { from: /components\/AuthLayout/g, to: 'components/layout/AuthLayout' },
  { from: /components\/Layouts/g, to: 'components/layout' },
  { from: /contextAPI\/Anouncement/g, to: 'context/AnnouncementContext' },
  { from: /contextAPI/g, to: 'context' },
  { from: /pages\/Attedence_Managment/g, to: 'pages/Attendance' },
  { from: /pages\/Student_Managment/g, to: 'pages/Students' },
  { from: /pages\/Student\/Student_Managment/g, to: 'pages/Student/Students' },
  { from: /context\/Anouncement/g, to: 'context/AnnouncementContext' } // Just in case
];

let filesModified = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  replacements.forEach(rep => {
    content = content.replace(rep.from, rep.to);
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    filesModified++;
  }
});

console.log(`Updated imports in ${filesModified} files.`);

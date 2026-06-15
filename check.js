const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBtk6JKEtKDHmjrgjRXs0SIsV3kAD796jk",
  authDomain: "turris-forge.firebaseapp.com",
  projectId: "turris-forge",
  storageBucket: "turris-forge.firebasestorage.app",
  messagingSenderId: "850138800359",
  appId: "1:850138800359:web:c4c63d431589edab970242"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

getDocs(collection(db, 'jobs')).then(snap => {
  snap.docs.forEach(d => {
    const data = d.data();
    if (data.status === 'In Progress') {
      console.log('Job:', data.title);
      console.log('acceptedBy:', data.acceptedBy);
      console.log('status:', data.status);
    }
  });
  process.exit(0);
}).catch(err => {
  console.error(err.message);
  process.exit(1);
});

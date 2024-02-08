import React from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyCCzMLGqF4OC_ADdhMDq5eD3EVYzvvHYcM",
  authDomain: "superchat-b4fb9.firebaseapp.com",
  projectId: "superchat-b4fb9",
  storageBucket: "superchat-b4fb9.appspot.com",
  messagingSenderId: "447411551161",
  appId: "1:447411551161:web:00653682fb8085f71c1468",
  measurementId: "G-F2PXGGXDP7"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [snapshot] = useCollection(query);
  return (
    <>
    <div>
      {snapshot && snapshot.docs.map(doc => (
          <ChatMessage key={doc.id} message={doc.data()} />
        ))}
    </div>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img scr={photoURL}/>
      <p>{text}</p>
    </div>
  )
}

export default App;

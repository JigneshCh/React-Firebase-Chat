/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
import React, { useRef, useState } from 'react';


import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB-BV9CfuFMcFSXRF3M74FqGTXMM4lSjCs',
  authDomain: 'jignesh-demo.firebaseapp.com',
  projectId: 'jignesh-demo',
  storageBucket: 'jignesh-demo.appspot.com',
  messagingSenderId: '826083086352',
  appId: '1:826083086352:web:14fdc0c2c0bba0f7ddfa95',
  measurementId: 'G-CVWNCFHX51'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [user] = useAuthState(auth);
console.log(user);
  return (
    <div className="App">
      <header>
        <SignOut/>
      </header>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  async function signInWithGoogle() {
	const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
  }

  return (
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();

  const recentMessagesQuery = query(
    collection(getFirestore(), 'chat-group-jignesh'),
    orderBy('createdAt', 'asc'),
    limit(50)
  );

  const [messages] = useCollectionData(recentMessagesQuery, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid } = auth.currentUser;
	
	await addDoc(collection(getFirestore(), 'chat-group-jignesh'), {
      name: getAuth().currentUser.displayName,
      text: formValue,
      createdAt: serverTimestamp(),
      uid
    });

    setFormValue('');
  };

  return (
     <div>
     <div className="chat-container">
        {messages &&
          messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}

        <span ref={dummy} />
    </div>
	
	<form className="chatbox-input" onSubmit={sendMessage}>
	    <i className="fa fa-regular fa-face-grin"/>
	    <i className="fa fa-sharp fa-solid fa-paperclip"/>
	    <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type message"
        />

        <button type="submit" disabled={!formValue}>
          <i className="fa fa-solid fa-send"/>
        </button>
      </form>
	 </div> 
  );
}

function ChatMessage(props) {
  const { text, uid, name } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'message-box my-message' : 'message-box friend-message';

  return (
    <div>
      <div className={`message ${messageClass}`}>
        <p className="text messageBubble">
          <b className="nameTag">{`${name}`}</b>
          <br /> {text}
        </p>
      </div>
    </div>
  );
}

export default App;
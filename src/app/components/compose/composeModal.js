// ComposeModal.js
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { apiconnector } from '../../services/apiconnector';

const ComposeModal = ({ showModal, setShowModal }) => {
  const { accesstoken } = useSelector((state) => state.User);
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const email = [
      `To: ${to}`,
      `Cc: ${cc}`,
      `Bcc: ${bcc}`,
      `Subject: ${subject}`,
      "",
      body,
    ].join("\n");

    const encodedEmail = btoa(unescape(encodeURIComponent(email)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    try {
      await apiconnector(
        "POST",
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`,
        { raw: encodedEmail },
        {
          Authorization: `Bearer ${accesstoken}`,
          'Content-Type': 'application/json',
        }
      );
      alert('Message sent successfully!');
      setShowModal(false); // Close modal on success
    } catch (error) {
      console.error("Error sending message:", error);
      alert('Failed to send message');
    }
  };

  return (
    showModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-md shadow-md max-w-md w-full">
          <h2 className="text-lg font-semibold mb-4">Compose Email</h2>
          <form onSubmit={sendMessage}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="to">To</label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="email"
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="cc">Cc</label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="email"
                id="cc"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="bcc">Bcc</label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="email"
                id="bcc"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="subject">Subject</label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="body">Body</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows="10"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default ComposeModal;

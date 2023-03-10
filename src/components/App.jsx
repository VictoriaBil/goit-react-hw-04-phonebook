import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form } from './Form/Form';
import { ContactList } from './ContactList/ContactList';
import Filter from './Filter/Filter';
import Notification from './Notification/Notification';
import { nanoid } from 'nanoid';
import css from './App.module.css';

export function App() {
  const [contacts, setContacts] = useState(
    () => JSON.parse(localStorage.getItem('contacts')) ?? []
  );

  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const changeFilter = e => {
    setFilter(e.currentTarget.value.trim());
  };

  function addContact({ name, number }) {
    if (
      contacts.find(
        contact => contact.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      return toast.warning(`${name} is alredy in contacts.`, {
        autoClose: 2000,
        theme: 'colored',
      });
    } else if (contacts.find(contact => contact.number === number)) {
      return toast.warning(`${number} is already in contacts`, {
        autoClose: 2000,
        theme: 'colored',
      });
    } else {
      setContacts([...contacts, { id: nanoid(), name, number }]);
      toast.success(`${name} has been added`, {
        autoClose: 2000,
        theme: 'colored',
      });
    }
  }

  function deleteContact(id) {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast.success('The contact has been deleted', {
      autoClose: 2000,
    });
  }

  function filteredContacts() {
    const normalisedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalisedFilter)
    );
  }

  return (
    <div className={css.container}>
      <h1 className={css.title}>Phonebook</h1>
      <Form onSubmit={addContact} />
      <h2 className={css.title}>Contacts</h2>
      {contacts.length === 0 ? (
        <Notification message="There are no contacts in your phonebook yet" />
      ) : (
        <Filter value={filter} onChange={changeFilter} />
      )}
      <ContactList
        contacts={filteredContacts()}
        deleteContact={deleteContact}
      />
      <ToastContainer />
    </div>
  );
}

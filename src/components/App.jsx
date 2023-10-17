import React, { Component } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { nanoid } from 'nanoid'
import { GiRotaryPhone} from 'react-icons/gi'

import { ContactForm } from '../components/ContactForm/ContactForm'
import { Filter } from '../components/Filter/Filter'
import { ContactList } from '../components/ContactList/ContactList'

import {Container, FormContainer, StatisticsContainer, ContactsHeading, MainHeading, NoContactsText} from './Container'

Notify.init({
  borderRadius: '10px',
  position: 'top-right',
  width: '400px',
  timeout: 4000,
  clickToClose: true,
  cssAnimationStyle: 'zoom',
});

class App extends Component {
state = {
  contacts: [
    {id: 'id-1', name: 'Rosie Simpson', number: '459-12-56'},
    {id: 'id-2', name: 'Hermione Kline', number: '443-89-12'},
    {id: 'id-3', name: 'Eden Clements', number: '645-17-79'},
    {id: 'id-4', name: 'Annie Copeland', number: '227-91-26'},
  ],
  filter: '',
    }

  componentDidMount() {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts !== null) {
      this.setState({ contacts: JSON.parse(savedContacts) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const currentContacts = this.state.contacts;
    const previousContacts = prevState.contacts;
    if (currentContacts !== previousContacts) {
      localStorage.setItem('contacts', JSON.stringify(currentContacts));
    }
  }
  
  onRemoveContact = (contactId) => {
     this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId)
    }))
    Notify.success('The contact has been successfully removed');
  }
  
  onAddingContact = ({ name, number }) => {
    const { contacts } = this.state;
    if (contacts.some(contact => contact.name.toLowerCase() === name.toLowerCase())) {
        return Notify.info(`${name} is already among your contacts`);
    }

    console.log({name, number});
    const contact = {
      name,
      number,
      id: nanoid(),
    }

    this.setState(prevState => {
      return {
        contacts: [...prevState.contacts, contact],
      };
    } );
    Notify.success(`${name} has been successfully added to your contacts`);

      
  }
  
  onFilterChange = event => {
    this.setState({ filter: event.currentTarget.value })
  }

  onFilteringContacts = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase()
    return contacts.filter(contact => contact.name.toLowerCase().includes(normalizedFilter));

  }
    
  render() {

    const { filter, contacts } = this.state;
  
    const filteredContacts = this.onFilteringContacts();

   return (
    <Container>
      <FormContainer>
         <MainHeading>Phonebook <GiRotaryPhone/></MainHeading>
         <ContactForm onSubmit={this.onAddingContact} />
        </FormContainer>
<StatisticsContainer>
  <ContactsHeading>Contacts</ContactsHeading>
       <Filter value={filter} onChange={ this.onFilterChange} />
      {contacts.length ? (<ContactList contacts={filteredContacts} onRemoveContact={this.onRemoveContact} />) : (<NoContactsText>There are no contacts in your phoneboook</NoContactsText>)}
    </StatisticsContainer>
       </Container>
  )
}
}

export default App;
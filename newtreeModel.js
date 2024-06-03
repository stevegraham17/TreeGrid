import { LightningElement ,track} from 'lwc';
import getAccountContactDetails from '@salesforce/apex/treeGridClass.getAccountsDetails';

export default class NewtreeModel extends LightningElement {
   


    @track gridColumns=[
        {label:'Account Name', fieldName:'Name'},
        {label:'First Name', fieldName:'FirstName'},
        {label:'Last Name', fieldName:'LastName'}
    ]

    @track gridData;
    @track selectedAccounts;
   
   

    connectedCallback(){

        getAccountContactDetails()
        .then(result=>{

            const temp=JSON.parse(JSON.stringify(result));
            for(var i=0;i<temp.length;i++){
                var relatedContacts = temp[i]['Contacts'];
                if(relatedContacts){
                    temp[i]._children=relatedContacts;
                    delete temp[i].Contacts;
            }
        }
        this.gridData=temp;

        })
       
    }
   

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        const selectedAccounts = [];
    
        selectedRows.forEach(account => {
            if (account.level === 1) {
                const accountObj = {
                    Id: account.Id,
                    Name: account.Name,
                    level: account.level,
                    posInSet: account.posInSet,
                    setSize: account.setSize,
                    isExpanded: account.isExpanded,
                    hasChildren: account.hasChildren,
                    Contacts: []
                };
    
                selectedRows.forEach(contact => {
                    if (contact.level === 2 && contact.AccountId === account.Id) {
                        accountObj.Contacts.push({
                            AccountId: contact.AccountId,
                            Id: contact.Id,
                            FirstName: contact.FirstName,
                            LastName: contact.LastName,
                            level: contact.level,
                            posInSet: contact.posInSet,
                            setSize: contact.setSize,
                            isExpanded: contact.isExpanded
                        });
                    }
                });
    
                selectedAccounts.push(accountObj);
            }
        });
    
        this.selectedAccounts = selectedAccounts;
        console.log('Data:::', JSON.stringify(this.selectedAccounts));
    }
    
}

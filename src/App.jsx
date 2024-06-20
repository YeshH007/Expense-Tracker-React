import { useState } from 'react'
import './App.css'
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useReducer } from 'react';
import { Modal as BaseModal } from '@mui/base/Modal';
import { styled, css } from '@mui/system';
import { forwardRef } from 'react';
import { IncomeListItem } from '../components/IncomeListItem';
import { ExpenseListItem } from '../components/ExpenseListItem';
import { PieChart } from '@mui/x-charts/PieChart';
import React from 'react';
function App() {
  const [open,setOpen]=useState(false);
  const handleopen=()=>{setOpen(true)};
  const handleclose=()=>{setOpen(false)};

  let initialstate={
    totalbalance:0,
    totalincome:0,
    totalexpense:0,
    radiovalue:null,
    transactionname:null,
    transactionamount:null,
    incomelistarr:[],
    expenselistarr:[],
    nextId:1,
    editstate:false,
    edittargetitem:null
  }

  const [currentstate,dispatch]=useReducer(reducer,initialstate)
  function reducer(state,action){
    switch(action.type){
      case 'expense':
        return {...state,radiovalue :state.radiovalue ='expense'}
      case 'income':  
        return {...state,radiovalue :state.radiovalue ='income'}
      case 'updatetransactionname':
        return {...state, transactionname: action.payloadname}
      case 'updatetransactionamount':
        return {...state, transactionamount: action.payloadamount}  
      case 'addbutton':
        setOpen(false)
        if(state.radiovalue=='income'){  
          return {...state,incomelistarr:[...state.incomelistarr,{
            id:state.nextId,
            name:state.transactionname,
            amount:state.transactionamount
          }],transactionname:null
          ,transactionamount:null
          ,radiovalue:null,nextId:state.nextId+1,
          totalincome:Number(state.totalincome)+Number(state.transactionamount),
          totalbalance:Number(state.totalincome)-Number(state.totalexpense)
        }
        }else if(state.radiovalue=='expense'){
        console.log(state)  
          return {...state,expenselistarr:[...state.expenselistarr,{
            id:state.nextId,
            name:state.transactionname,
            amount:state.transactionamount
          }],transactionname:null
          ,transactionamount:null
          ,radiovalue:null,
          nextId:state.nextId+1,
          totalexpense:Number(state.totalexpense)+Number(state.transactionamount),
          totalbalance:Number(state.totalincome)-Number(state.transactionamount)
        }
        }
      case "delete":
        let deleteitem=action.deletepayload.target.parentElement.parentElement
        if(deleteitem.className==='incomelistitem'){
        let sec=state.incomelistarr.filter((i)=> i.id!=deleteitem.id)
        return {...state,incomelistarr:[...sec]
          ,totalbalance:Number(state.totalincome)-Number(state.transactionamount)
          ,totalincome:Number(state.totalincome)-Number(action.deletepaylaodamount)};  
        } 
        if(deleteitem.className==='expenselistitem'){
          let sec=state.expenselistarr.filter((i)=> i.id!=deleteitem.id)
          console.log(sec,state.expenselistarr)
          return {...state,expenselistarr:[...sec],totalbalance:Number(state.totalexpense)-Number(state.transactionamount)
            ,totalexpense:Number(state.totalexpense)-Number(action.deletepaylaodamount)};  
          } 
      case "editstate":
        let edititem=action.editpayload.target.parentElement.parentElement
        console.log(edititem.className,edititem.id)
        return {...state,editstate:true,edittargetitem:edititem}
      case 'changeedititem':
        setOpen(false)
        if(state.editstate===true){
          if(state.edittargetitem.className=='incomelistitem'){
            let newarr=[...state.incomelistarr]
            for(let i=0;i<newarr.length;i++){
              if(Number(newarr[i].id)==Number(state.edittargetitem.id)){
                newarr[i].name=state.transactionname
                newarr[i].amount=state.transactionamount
              }
            }
            let newtotalincome=0;
            newarr.forEach(element => {
              newtotalincome=Number(newtotalincome)+Number(element.amount)
            });
            console.log(newarr,newtotalincome)
            console.log(newarr)
            return {...state,editstate:false,
              incomelistarr:newarr,transactionname:null,
              transactionamount:null,
              totalincome:newtotalincome,
              totalbalance:Number(state.totalincome)-Number(state.totalexpense)
            }
          }else if(state.edittargetitem.className=='expenselistitem'){
            let newarr=[...state.expenselistarr]
            for(let i=0;i<newarr.length;i++){
              if(Number(newarr[i].id)==Number(state.edittargetitem.id)){
                newarr[i].name=state.transactionname
                newarr[i].amount=state.transactionamount
              }
            }
            let newtotalexpense=0;
            newarr.forEach(element => {
              newtotalexpense=Number(newtotalexpense)+Number(element.amount)
            });
            console.log(newarr,newtotalexpense)
            return {...state,editstate:false,
              expenselistarr:newarr,transactionname:null,
              transactionamount:null,
              totalexpense:newtotalexpense,
              totalbalance:Number(state.totalincome)-Number(state.totalexpense)
            }
          }
        }
      default:
        return initialstate 
    }
  }
  console.log(currentstate)
  return(
    
    <div className="wraper">
      <h1 className='heading'>Expense Tracker </h1>
      <TriggerButton type="button" onClick={handleopen}>
        Add Transaction
      </TriggerButton>
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleclose}
        slots={{ backdrop: StyledBackdrop }}
      >
        <ModalContent sx={{ width: 600,height:"50vh" }}>
          <form action="" onSubmit={(e)=>e.preventDefault()}>
            <div className="form">
              <div  className='formlabels'>
                <label htmlFor="inputtransactionname">Transaction Name:</label>
                <input type="text" name="" onChange={(e)=>{dispatch({type:'updatetransactionname',payloadname: e.target.value}) }} id="inputtransactionname" placeholder='Transaction name' />
              </div>
              <div className='formlabels'>
              <label htmlFor="inputamount">Amount:</label>
              <input type="number" onChange={(e)=>{dispatch({type:'updatetransactionamount',payloadamount:e.target.value})}} onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()} name="" id="inputamount" placeholder='Amount'  />
              </div>
              <div style={currentstate.editstate===true?{display:"none"}:{display:"flex"}} >
                <label htmlFor="incomeradio">Income</label>
                <input  checked={currentstate.radiovalue==='income'} onChange={()=>dispatch({type:'income'})} type="radio" name="income" id="incomeradio" />
                <label htmlFor="expenseradio">Expense</label>
                <input  checked={currentstate.radiovalue==='expense'} type="radio" name="income" onChange={()=>dispatch({type:'expense'})}  id="expenseradio" />
              </div>
            <button className='addbutton' onClick={()=>{currentstate.editstate==false?dispatch({type:'addbutton'}):dispatch({type:'changeedititem'})}} >{currentstate.editstate===true ? 'Edit Transaction':'Add Transaction'}</button>
            </div>
          </form>
        </ModalContent>
      </Modal>
      <div className='datawrap'>
        <div className="balancebox">
          <h1 className="totalbalance">
            {
              Number(currentstate.totalincome-currentstate.totalexpense)<0 ?
              `Total Balance is Rs.${(currentstate.totalincome-currentstate.totalexpense)*(-1)} in debt`
              :`Total Balance is Rs.${currentstate.totalincome-currentstate.totalexpense}`
            }
          </h1>
          <h2 className="totalincome">
            Total Income Rs. {currentstate.totalincome}
          </h2>
          <h2 className="totalexpense">
            Total Expense Rs. {currentstate.totalexpense}
          </h2>
        </div>
        <div className="chartbox">
        <PieChart colors={['green', 'red']} series={[
          {
            data: [
              { id: 0, value: currentstate.totalincome, label: 'Income' },
              { id: 1, value: currentstate.totalexpense, label: 'Expense' },
            ],
          },
        ]}
          width={450}
          height={300}
        />
        </div>
      </div>
      <div className="transactionbox">
        <div className="incomelist">
          <h2>Income</h2>
          {
            currentstate.incomelistarr.map((i,index)=>{
              return <IncomeListItem itemname={i.name} itemamount={i.amount} id={i.id} key={index} dispatch={dispatch}></IncomeListItem>
              // console.log(i.name)
            })
          }
        </div>
        <div className="expenselist">
        <h2>Expense</h2>
        {
            currentstate.expenselistarr.map((i,index)=>{
              return <ExpenseListItem itemname={i.name} itemamount={i.amount} id={i.id} key={index}dispatch={dispatch}></ExpenseListItem>
            })
          }
        </div>
      </div>
    </div>
  )
}







const Backdrop = forwardRef((props, ref) => {
  const { open, className, ...other } = props;
  return (
    <div
      className={clsx({ 'base-Backdrop-open': open }, className)}
      ref={ref}
      {...other}
    />
  );
});

Backdrop.propTypes = {
  className: PropTypes.string.isRequired,
  open: PropTypes.bool,
};

const blue = {
  200: '#99CCFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0066CC',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const ModalContent = styled('div')(
  ({ theme }) => css`
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex start;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === 'dark' ? 'rgb(0 0 0 / 0.5)' : 'rgb(0 0 0 / 0.2)'};
    padding: 24px;
    color: ${theme.palette.mode === 'dark' ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === 'dark' ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `,
);



const TriggerButton = styled('button')(
  ({ theme }) => css`
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 150ms ease;
    cursor: pointer;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    }

    &:active {
      background: ${theme.palette.mode === 'dark' ? grey[700] : grey[100]};
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
      outline: none;
    }
  `,
);

export default App

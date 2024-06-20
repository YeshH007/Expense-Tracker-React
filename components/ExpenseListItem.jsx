export function ExpenseListItem({itemname,itemamount,id,dispatch}){
    return(
        <div className="expenselistitem" id={id}>
            <span>{itemname}</span>
            <div className='buttons'>
            <span style={{margin:'10px'}} >Rs.{itemamount}</span>
            <button className="deletelistitem" onClick={(e)=>{dispatch({type:'delete',deletepayload:e,deletepaylaodamount:itemamount})}}>X</button>
            <button className="updatelistitem" onClick={(e)=>{dispatch({type:'editstate',editpayload:e})}}>edit</button>
            </div>
        </div>
    )
}
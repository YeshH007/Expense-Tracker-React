import '../src/App.css'
export function IncomeListItem({itemname,itemamount,id,dispatch}){
    return(
        <div className="incomelistitem" id={id}>
            <span>{itemname}</span>
            <div className='buttons'>
                <span style={{margin:'10px'}}>{`Rs. ${itemamount}`}</span>
                <button className="deletelistitem" onClick={(e)=>{dispatch({type:'delete',deletepayload:e,deletepaylaodamount:itemamount})}}> &#10005;</button>
                <button className="updatelistitem" onClick={(e)=>{dispatch({type:'editstate',editpayload:e})}}>edit</button>
            </div>
        </div>
    )
}
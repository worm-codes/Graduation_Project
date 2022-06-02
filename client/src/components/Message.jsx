import "../public/message.css";



export default function Message({ message, own,bothInChat }) {
   

  

  return (
    <div  className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
          alt=""
        />
       
        {message.text.split('\n').length!=0? <p className="messageText">{message.text.split('\n').map((item, i) => <span  key={i}>{item} {own?(message.unread && !bothInChat   ? <img src="https://img.icons8.com/emoji/27/000000/see-no-evil-monkey.png"/>:<img src="https://img.icons8.com/emoji/27/000000/eyes-emoji.png"/> ):""} <br /></span>)} 
         <b style={{color:'black',fontSize:'0.9rem'}}>   {message.createdAt} </b>  </p>:<p className="messageText">{message.text}  <i className="fa fa-envelope fa-lg" aria-hidden="true"></i> 
         <b style={{color:'black',fontSize:'0.9rem'}}>  {message.createdAt} </b>  </p>}
         
          
        </div>
        
 
    </div>
  );
}

import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-bootstrap/Toast';
import { hideMessage } from '../../redux/messageSlice';
import './MessageToast.scss';

// import type { RootState } from '../../index'; // או מ־store.ts אם העברת לשם

interface MessageToastProps {}

const MessageToast: FC<MessageToastProps> = () =>  {
  const dispatch = useDispatch();
  const { show, title, body, delay } = useSelector((state:any) => state.messageSlice);
  // הסתרה אוטומטית
  React.useEffect(() => {
    if (show && delay) {
      const timeout = setTimeout(() => {
        dispatch(hideMessage());
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [show, delay, dispatch]);

  if (!show) return null;

  return (
    <div className="custom-toast" role="status">
      <div className="custom-toast-header">
        <button onClick={() => dispatch(hideMessage())} aria-label="סגירה">×</button>
        <strong>{title}</strong>   
      </div>
      <div className="custom-toast-body">{body}</div>
    </div>
  );
//   return (
//     // <Row className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
//     //   <Col>
//     //     <Toast onClose={() => dispatch(hideMessage())} show={show} delay={delay} autohide>
//     //       <Toast.Header>
//     //         <strong className="me-auto">{title}</strong>
//     //         <small>רגע</small>
//     //       </Toast.Header>
//     //       <Toast.Body>{body}</Toast.Body>
//     //     </Toast>
//     //   </Col>
//     // </Row>

//     <Row
//   className="position-fixed top-0 start-50 translate-middle-x p-3"
//   style={{ zIndex: 9999 }}
// >
//   <Col>
//     <Toast onClose={() => dispatch(hideMessage())} show={show} delay={delay} autohide>
//       <Toast.Header>
//         <strong className="me-auto">{title}</strong>
//         <small>רגע</small>
//       </Toast.Header>
//       <Toast.Body>{body}</Toast.Body>
//     </Toast>
//   </Col>
// </Row>

//   );
};

export default MessageToast;
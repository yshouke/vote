import './index.less';

export default function(props: { location: { pathname: string; }; children: any; }) {  
    return (
      <>
        <div className='user-layput-box'>
          <div className='login'>
            { props.children }
          </div>
        </div>
      </>
    );
  }
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // Import your user context

interface PrivateRouteProps {
  children: JSX.Element;
}

export default function PrivateRoute ( { children }: PrivateRouteProps ) {
  return ( 
    <AuthContext.Consumer>
      {(value) => 
        { 
          //console.log(value);
          return value.sdk === null ? <Navigate to='/Login'/> : children;
        }
      }
    </AuthContext.Consumer>
  );
};

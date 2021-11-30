import React, {useEffect} from "react";
import {css} from "@emotion/react";
import PropagateLoader from "react-spinners/PropagateLoader";
import { useSelector} from "react-redux";
//import {loadingSpinner} from "../redux/actions/vaccineActions";

const override = css`
  display: block;
  margin: 0 auto;
  text-align: center;
`;

const Spinner = () => {
  //const dispatch = useDispatch();
  const color = "#BD10E0"; 
  useEffect(() => { 
    setTimeout(() => {
      //dispatch(loadingSpinner(false));
    }, 1000);
  }, []);
  const loading =   useSelector((state) => state.vaccineDetails.loadingSpinner);
  return(
    <div>
      {loading&& <div  className="divLoader"   >
<p >
<PropagateLoader color={color} loading={loading} css={override} size={40} />
</p>
</div>}
    </div>
  )
  
};

export default Spinner;

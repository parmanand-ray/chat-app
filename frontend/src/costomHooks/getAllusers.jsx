import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import { setAllUser } from "../redux/userSlice";

const getAllusers = () => {
  let dispatch = useDispatch();
  let { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        let result = await axios.get(`${serverUrl}/api/user/all-users`, {
          withCredentials: true,
        });
        dispatch(setAllUser(result.data.user));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [userData]);
};
export default getAllusers;

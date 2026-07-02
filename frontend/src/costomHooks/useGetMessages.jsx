import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../main";
import { setMessages } from "../redux/messageSlice";

const useGetMessages = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id) {
        dispatch(setMessages([]));
        return;
      }

      try {
        const result = await axios.get(
          `${serverUrl}/api/message/get/${selectedUser._id}`,
          {
            withCredentials: true,
          },
        );

        const fetchedMessages = Array.isArray(result.data)
          ? result.data
          : result.data?.messages || result.data?.data || [];

        dispatch(setMessages(fetchedMessages));
      } catch (error) {
        console.log(error);
        dispatch(setMessages([]));
      }
    };

    fetchMessages();
  }, [dispatch, selectedUser?._id]);
};

export default useGetMessages;

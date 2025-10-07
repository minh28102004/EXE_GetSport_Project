import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserQuery } from "@redux/api/account/accountApi";
import { selectToken, setUserProfile } from "@redux/features/auth/authSlice";
import { getUserIdFromToken } from "@utils/jwt";

const CurrentUserHydrator = () => {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const id = useMemo(() => getUserIdFromToken(token), [token]);

  // Giữ query luôn "active" để nhận invalidatesTags từ updateAccount
  const { data } = useGetUserQuery(id!, {
    skip: !id,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Bất cứ khi nào API trả về account mới → cập nhật auth.user
  useEffect(() => {
    const a = data?.data;
    if (!a) return;
    dispatch(
      setUserProfile({
        user: { fullname: a.fullName, email: a.email, role: a.role },
      })
    );
  }, [data, dispatch]);

  return null;
};

export default CurrentUserHydrator;

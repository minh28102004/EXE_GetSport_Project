import React, { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCheckDepositStatusQuery } from '@redux/api/wallet/walletApi';

const DepositSuccess: React.FC = () => {
  const { orderCode } = useParams<{ orderCode: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get('status');
  const cancel = searchParams.get('cancel');

  const { data, error, isLoading } = useCheckDepositStatusQuery(Number(orderCode), {
    skip: !orderCode || !status,
  });

  useEffect(() => {
    if (isLoading) return;

    if (error) {
      toast.error((error as any)?.data?.message || 'Lỗi khi kiểm tra trạng thái thanh toán.');
      setTimeout(() => navigate('/profile'), 3000);
      return;
    }

    if (data?.success) {
      if (data.message === 'Deposit completed successfully.') {
        toast.success(`Nạp tiền thành công! Số dư mới: ${data.data?.balance?.toLocaleString('vi-VN')} ₫`);
      } else if (data.message === 'Deposit cancelled.') {
        toast.error('Giao dịch đã bị hủy.');
      } else {
        toast.info(`Trạng thái: ${data.message}`);
      }
      setTimeout(() => navigate('/profile'), 3000);
    }
  }, [data, error, isLoading, navigate]);

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8 flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
        {isLoading ? (
          <>
            <div className="w-12 h-12 mx-auto border-4 border-[#23AEB1] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 mt-4">Đang kiểm tra trạng thái thanh toán...</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {data?.message === 'Deposit completed successfully.'
                ? 'Nạp Tiền Thành Công'
                : data?.message === 'Deposit cancelled.'
                ? 'Giao Dịch Bị Hủy'
                : 'Đang Xử Lý'}
            </h2>
            <p className="text-gray-500 mb-6">
              {data?.message === 'Deposit completed successfully.'
                ? `Số dư ví của bạn đã được cập nhật: ${data.data?.balance?.toLocaleString('vi-VN')} ₫`
                : data?.message === 'Deposit cancelled.'
                ? 'Giao dịch đã bị hủy. Không có thay đổi về số dư.'
                : `Trạng thái: ${data?.message || 'Đang kiểm tra...'}`}
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2.5 bg-gradient-to-r from-[#23AEB1] to-[#1B8E90] text-white rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Về Trang Hồ Sơ
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DepositSuccess;
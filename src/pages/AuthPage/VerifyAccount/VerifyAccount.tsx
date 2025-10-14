import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useVerifyAccountMutation } from "@redux/api/auth/authApi";
import LoadingSpinner from "@components/Loading_Spinner";

const VerifyAccount: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [verifyAccount, { isLoading }] = useVerifyAccountMutation();

  useEffect(() => {
    const userId = searchParams.get("userId");
    const token = searchParams.get("token");

    const verify = async () => {
      if (!userId || !token) {
        setError("Missing User ID or verification token in the URL.");
        return;
      }

      const userIdNum = parseInt(userId);
      if (isNaN(userIdNum) || userIdNum <= 0) {
        setError("User ID must be a valid number.");
        return;
      }

      try {
        const response = await verifyAccount({
          userId: userIdNum,
          token: token.trim(),
        }).unwrap();
        setSuccess(response.message || "Account verified successfully.");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
      } catch (err: any) {
        console.error("Verification Error:", err);
        setError(
          err.data?.message ||
            err.message ||
            "An error occurred while verifying your account."
        );
      }
    };

    verify();
  }, [searchParams, verifyAccount, navigate]);

  return (
    <div className="min-h-screen bg-slate-100/60 flex items-center justify-center py-10">
      <div className="mx-auto max-w-md px-5">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Verify Your Account
          </h1>

          {isLoading && (
            <div className="text-center text-gray-600 text-lg">
              <LoadingSpinner inline size="6" />
              <p className="mt-4">Verifying your account...</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <p>{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !success && !error && (
            <p className="text-gray-600 text-center">
              Processing your verification request...
            </p>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Already verified?{" "}
            <a href="/login" className="text-[#2ebabc] hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
import React from "react";

export function ConfirmEmailPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-pink-100 to-pink-200 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-4 border-pink-200">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Check Your Email
          </h1>
          <p className="text-gray-600 text-center">
            We've sent a confirmation email to your address. Please click the
            link in the email to confirm your account.
          </p>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface TodoHeaderProps {
  username?: string;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({ username = "John Doe" }) => {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-gray-100 px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">My To-Do List</h1>
              <p className="text-gray-600 mt-1">Tasks assigned to {username}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
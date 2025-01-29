import { X, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

export const showToast = ({ message, type = 'success' }) => {
  toast[type](
    <div className="flex items-center justify-between w-full">
      <span className="flex items-center">
        {type === 'success' && <CheckCircle className="h-4 w-4 mr-2 text-green-500" />}
        {type === 'error' && <XCircle className="h-4 w-4 mr-2 text-red-500" />}
        {message}
      </span>
      <button
        onClick={() => toast.dismiss()}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <X className="h-4 w-4" />
      </button>
    </div>,
    {
      duration: 3000,
    }
  )
}

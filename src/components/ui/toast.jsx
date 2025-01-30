import { CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

export const showToast = ({ message, type = 'success' }) => {
  toast[type](message, {
    duration: 3000,
    style: {
      width: 'fit-content',
      minWidth: 'min-content'
    }
  })
}

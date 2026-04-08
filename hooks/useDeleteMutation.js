import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";

const useDeleteMutation = (queryKey, deleteEndpoint) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, deleteType }) => {
      const { data } = await axios({
        url: deleteEndpoint,
        method: deleteType === "PD" ? "DELETE" : "PUT",
        data: { ids, deleteType },
      });
      if (!data.success) {
        throw new Error(data.message);
      }
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message || "Operation successful");
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error) => toast.error(error.message || "Operation failed"),
  });
};

export default useDeleteMutation;

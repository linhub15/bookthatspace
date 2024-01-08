import { supabase } from "@/src/supabase";
import { TablesInsert } from "@/src/types/supabase_types";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";

export function useAddBooking() {
  const mutation = useMutation({
    mutationFn: async (booking: TablesInsert<"room_booking">) => {
      const { error } = await supabase.from("room_booking")
        .insert(booking);
      if (error) {
        alert(error.message);
        throw error;
      }
    },
  });

  return mutation;
}

export function useAddBookingForm() {
  const form = useForm({
    defaultValues: {
      thing: "",
    },
    onSubmit: async () => {
    },
  });

  return form;
}

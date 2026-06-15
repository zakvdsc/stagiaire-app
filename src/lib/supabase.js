import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://frlndrssozheemvxqvyy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZybG5kcnNzb3poZWVtdnhxdnl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MTAwMDksImV4cCI6MjA5NzA4NjAwOX0.D-dXMqkpJZl1OPUJ1PS-lxZIUH-sMK_KdY9t_WyfXzA"
);
-- Create function to update timestamps if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table for user investments
CREATE TABLE public.user_investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id TEXT NOT NULL,
  amount DECIMAL(12, 2),
  invested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  current_value DECIMAL(12, 2),
  return_percentage DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own investments" 
ON public.user_investments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own investments" 
ON public.user_investments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investments" 
ON public.user_investments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own investments" 
ON public.user_investments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_investments_updated_at
BEFORE UPDATE ON public.user_investments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
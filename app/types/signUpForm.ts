export type SignupFormData = {
  email: string;
  password: string;
  confirmPassword: string;
  data: {
    name: string;
    job_title?: string;
  };
};

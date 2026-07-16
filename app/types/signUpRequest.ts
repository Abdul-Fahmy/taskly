export type SignUpRequest = {
  email: string;
  password: string;

  data: {
    name: string;
    job_title?: string;
  };
};

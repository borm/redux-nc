import path from 'path';

export const umd = {
  env: process.env.NODE_ENV,
  source: path.join(__dirname, 'src'),
  output: path.join(__dirname),
};

export const demo = {
  env: process.env.NODE_ENV,
  host: '127.0.0.1',
  port: process.env.PORT || 5000,
  source: path.join(__dirname, 'demo'),
  output: path.join(__dirname),
};

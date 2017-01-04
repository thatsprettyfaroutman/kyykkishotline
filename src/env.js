import env from 'node-env-file'
import path from 'path'
env(path.join(process.cwd(), '.env'))

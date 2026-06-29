import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authToken = req.headers['x-registration-token'];
  if (authToken !== process.env.spinstrzservices) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const privateKey = process.env.AGENT_PRIVATE_KEY;
  if (!privateKey) {
    return res.status(500).json({ error: 'AGENT_PRIVATE_KEY environment variable not set' });
  }

  try {
    console.log('Installing ACP CLI...');
    try {
      await execAsync('npm list -g @virtuals-protocol/acp-cli');
    } catch {
      console.log('Installing ACP CLI globally...');
      await execAsync('npm install -g @virtuals-protocol/acp-cli');
    }

    console.log('Configuring ACP...');
    const configEnv = {
      ...process.env,
      ACP_PRIVATE_KEY: MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgj8cz2Bj2AuuPvHmwJqeqyB9eTHCxWHQl4Id9BFhv8EyhRANCAATXBYTFbgD72Smnunk2wCkKTLESNTto6Ozn6bktom5oseXv2Q9rrIqBpUKJA5thuiztAJKvBIEpkH3kPH7TUNyN
    };

    console.log('Registering token_metadata_lookup...');
    await execAsync(
      `acp offering create --name "token_metadata_lookup" --description "Get token metadata (decimals, chain, market cap) before trades" --price 0.02 --sla-minutes 2`,
      { env: configEnv }
    );

    console.log('Registering gas_estimate_check...');
    await execAsync(
      `acp offering create --name "gas_estimate_check" --description "Estimate Base transaction gas costs" --price 0.03 --sla-minutes 2`,
      { env: configEnv }
    );

    console.log('Fetching offering list...');
    const { stdout } = await execAsync('acp offering list', { env: configEnv });

    return res.status(200).json({
      status: 'success',
      message: 'Offerings registered successfully',
      offerings: stdout,
      services: [
        { name: 'token_metadata_lookup', price: '$0.02', status: 'registered' },
        { name: 'gas_estimate_check', price: '$0.03', status: 'registered' }
      ]
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      error: error.toString()
    });
  }
      }

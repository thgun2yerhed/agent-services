# Agent_s_Intelligence_Kiosk — Micro-Services

## Two Services Ready to Deploy

### Service 1: token_metadata_lookup
- **Price:** $0.02
- **Endpoint:** POST /api/services/token_metadata_lookup
- **Input:** { "token_symbol": "USDC" }
- **Returns:** Token decimals, chain, market cap
- **Use case:** Agents need token info before swaps/transfers

### Service 2: gas_estimate_check
- **Price:** $0.03
- **Endpoint:** POST /api/services/gas_estimate_check
- **Input:** { "transaction_type": "swap", "chain_id": "8453" }
- **Returns:** Estimated gas cost in GWEI
- **Use case:** Agents budget execution costs

---

## Deploy to Vercel (2 minutes)

1. **Create GitHub repo:**
   ```bash
   git init
   git add .
   git commit -m "Initial agent services"
   git remote add origin https://github.com/YOUR_USERNAME/agent-services.git
   git push -u origin main
   ```

2. **Link to Vercel:**
   - Go to vercel.com/new
   - Import the GitHub repo
   - Deploy (auto-builds with vercel.json config)

3. **Your live endpoint:** `https://agent-services.vercel.app`

---

## Register on ACP (from Vercel environment)

Once deployed, run these commands from Vercel's deployment shell or a connected environment:

```bash
# 1. Configure ACP with your wallet
acp configure
# Paste your private key when prompted

# 2. Register offering 1: token_metadata_lookup
acp offering create \
  --name "token_metadata_lookup" \
  --description "Get token metadata (decimals, chain, market cap) before executing trades" \
  --price 0.02 \
  --sla-minutes 2

# 3. Register offering 2: gas_estimate_check
acp offering create \
  --name "gas_estimate_check" \
  --description "Estimate transaction gas cost on Base mainnet" \
  --price 0.03 \
  --sla-minutes 2

# 4. Verify they're live
acp offering list

# 5. Browse the marketplace
acp browse token_metadata
```

---

## Resource Endpoints (for ACP)

Add these as **Resources** in the ACP web UI:

**Resource 1:**
- Name: `token_metadata_lookup`
- URL: `https://agent-services.vercel.app/api/services/token_metadata_lookup`
- Params: `{ "token_symbol": "string" }`

**Resource 2:**
- Name: `gas_estimate_check`
- URL: `https://agent-services.vercel.app/api/services/gas_estimate_check`
- Params: `{ "transaction_type": "string", "chain_id": "string" }`

---

## Test Locally

```bash
npm install
npm start
# Runs on http://localhost:3000

# Test service 1:
curl -X POST http://localhost:3000/api/services/token_metadata_lookup \
  -H "Content-Type: application/json" \
  -d '{"token_symbol":"USDC"}'

# Test service 2:
curl -X POST http://localhost:3000/api/services/gas_estimate_check \
  -H "Content-Type: application/json" \
  -d '{"transaction_type":"swap","chain_id":"8453"}'

# Health check:
curl http://localhost:3000/api/health
```

---

## Payment Flow

1. Buyer agent discovers your offerings via ACP
2. Buyer initiates job: pays $0.02 or $0.03 → ACP escrow
3. Your service responds → Buyer confirms
4. Settlement: You get 80% ($0.016 or $0.024), ACP gets 20%
5. **First payment lands in your wallet** (0x19774d017a37cf5c0a826ace39c77d1f9cefd77a)

---

## Next: Scale

Once payments land, add more services:
- Price feeds (CoinGecko API)
- Agent ranking (ACP Registry queries)
- Liquidity checks (DEX aggregator)

# EchoScribe — Guide de déploiement complet

## Prérequis
- Node.js 18+ installé
- Compte [Supabase](https://supabase.com) (gratuit)
- Compte [Stripe](https://stripe.com) (gratuit)
- Compte [Resend](https://resend.com) (gratuit jusqu'à 3000 emails/mois)
- Compte [Vercel](https://vercel.com) (gratuit)

---

## Étape 1 — Supabase

### 1.1 Créer le projet
1. Allez sur [app.supabase.com](https://app.supabase.com) → **New Project**
2. Choisissez un nom, un mot de passe fort, une région proche (ex: `eu-west-1`)
3. Attendez ~2 minutes que le projet soit prêt

### 1.2 Exécuter le schéma SQL
1. Dans votre projet Supabase → **SQL Editor** → **New query**
2. Copiez-collez **intégralement** le contenu de `supabase/schema.sql`
3. Cliquez **Run** — vous devez voir "Success. No rows returned"

### 1.3 Récupérer les clés
Dans **Settings → API** :
- `NEXT_PUBLIC_SUPABASE_URL` → Project URL (ex: `https://abc123.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` → service_role key (⚠️ à garder secret)

### 1.4 Configurer l'authentification
1. **Authentication → URL Configuration** :
   - Site URL : `https://votre-domaine.vercel.app`
   - Redirect URLs (ajouter les deux) :
     - `https://votre-domaine.vercel.app/api/auth/callback`
     - `https://votre-domaine.vercel.app/api/auth/callback?next=/reset-password`
2. **Authentication → Email Templates** : personnalisez si souhaité

> ⚠️ **Important — Mot de passe oublié** : le `redirectTo` utilisé lors du reset de mot de passe est `https://votre-domaine.vercel.app/api/auth/callback?next=/reset-password`. Cette URL **doit figurer dans la liste des Redirect URLs autorisées** dans Supabase, sinon les liens de réinitialisation seront rejetés.

---

## Étape 2 — Stripe

### 2.1 Créer les produits et prix
1. Allez dans [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Products → Add product** :
   - Nom : `EchoScribe Mensuel`
   - Prix : `39,00 €` / mois récurrent
   - Copiez le Price ID (ex: `price_1ABC...`) → `STRIPE_PRICE_MONTHLY`
3. Répétez pour l'annuel :
   - Nom : `EchoScribe Annuel`
   - Prix : `349,00 €` / an récurrent
   - Copiez le Price ID → `STRIPE_PRICE_YEARLY`

### 2.2 Récupérer les clés API
Dans **Developers → API keys** :
- `STRIPE_SECRET_KEY` : `sk_live_...` (ou `sk_test_...` pour les tests)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` : `pk_live_...`

### 2.3 Configurer le portail client Stripe
1. **Settings → Billing → Customer portal**
2. Activez : "Allow customers to cancel subscriptions"
3. Activez : "Allow customers to switch plans"
4. Sauvegardez

### 2.4 Configurer le webhook (après déploiement sur Vercel)
1. **Developers → Webhooks → Add endpoint**
2. URL : `https://votre-domaine.vercel.app/api/stripe/webhook`
3. Événements à écouter :
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.trial_will_end`
   - `invoice.payment_failed`
4. Copiez le **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## Étape 3 — Resend

1. Créez un compte sur [resend.com](https://resend.com)
2. **API Keys → Create API Key** → `RESEND_API_KEY`
3. **Domains → Add Domain** : ajoutez votre domaine (`echoscribe.fr`)
4. Configurez les enregistrements DNS indiqués par Resend chez votre registrar
5. Vérifiez le domaine (peut prendre quelques minutes)
6. `RESEND_FROM_EMAIL` : `EchoScribe <noreply@echoscribe.fr>`

---

## Étape 4 — Variables d'environnement

Copiez `.env.local.example` en `.env.local` et remplissez toutes les valeurs :

```bash
cp .env.local.example .env.local
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=EchoScribe <noreply@echoscribe.fr>

# App
NEXT_PUBLIC_APP_URL=https://echoscribe.fr
```

---

## Étape 5 — Installation et test local

```bash
# Depuis le dossier echoscribe-saas/
npm install

# Démarrer en développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) et testez :
- [ ] Page d'accueil s'affiche
- [ ] Inscription avec un email de test
- [ ] Email de confirmation reçu
- [ ] Connexion après confirmation
- [ ] Redirection vers /billing
- [ ] Formulaire Stripe Checkout (mode test)
- [ ] Redirection vers /app après paiement
- [ ] L'application EchoScribe se charge dans l'iframe
- [ ] Bouton "Déconnexion" fonctionne

### Tester Stripe en local avec Stripe CLI
```bash
# Installer Stripe CLI : https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Tester le flow mot de passe oublié
1. Allez sur `http://localhost:3000/forgot-password`
2. Entrez l'email d'un compte existant
3. Vérifiez la boîte mail — vous recevrez l'email via Supabase
4. Cliquez le lien **dans le même navigateur** que celui utilisé pour le formulaire
5. Le formulaire "Nouveau mot de passe" doit s'afficher
6. Entrez et confirmez un nouveau mot de passe
7. Vérifiez que la connexion fonctionne avec le nouveau mot de passe

> ⚠️ **Limitation PKCE** : le lien de réinitialisation doit être ouvert dans le **même navigateur** que celui du formulaire. Si l'email est ouvert dans l'app Gmail mobile (webview séparé), l'échange PKCE échouera. C'est une limitation connue de Supabase SSR avec PKCE activé par défaut.

---

## Étape 6 — Déploiement sur Vercel

### 6.1 Préparer le repository Git
```bash
cd echoscribe-saas
git init
git add .
git commit -m "Initial EchoScribe SaaS commit"
```

Créez un repository sur GitHub/GitLab et poussez :
```bash
git remote add origin https://github.com/votre-nom/echoscribe-saas.git
git push -u origin main
```

### 6.2 Déployer sur Vercel
1. Allez sur [vercel.com](https://vercel.com) → **New Project**
2. Importez votre repository GitHub
3. Framework : **Next.js** (détecté automatiquement)
4. **Environment Variables** : ajoutez toutes les variables de `.env.local`
5. Cliquez **Deploy**

### 6.3 Configurer le domaine personnalisé (optionnel)
1. Vercel → votre projet → **Settings → Domains**
2. Ajoutez `echoscribe.fr`
3. Configurez les DNS chez votre registrar selon les instructions Vercel
4. Mettez à jour `NEXT_PUBLIC_APP_URL` en variable d'environnement Vercel

### 6.4 Mettre à jour Supabase avec l'URL de production
1. Supabase → **Authentication → URL Configuration**
2. Site URL : `https://echoscribe.fr`
3. Redirect URLs (les deux sont requises) :
   - `https://echoscribe.fr/api/auth/callback`
   - `https://echoscribe.fr/api/auth/callback?next=/reset-password`

---

## Étape 7 — Vérifications post-déploiement

- [ ] `https://echoscribe.fr` → landing page
- [ ] `https://echoscribe.fr/register` → inscription
- [ ] Email de confirmation reçu (Supabase)
- [ ] Connexion après confirmation → `/app`
- [ ] `https://echoscribe.fr/forgot-password` → formulaire mot de passe oublié
- [ ] Email de réinitialisation reçu → lien fonctionne dans le même navigateur
- [ ] Nouveau mot de passe enregistré, connexion validée
- [ ] `https://echoscribe.fr/billing` → plans de paiement
- [ ] Checkout Stripe redirige correctement
- [ ] Webhook Stripe reçu (vérifier dans Stripe Dashboard → Webhooks → événements)
- [ ] `https://echoscribe.fr/app` → application EchoScribe dans iframe
- [ ] Microphone fonctionne (nécessite HTTPS)
- [ ] Pages légales accessibles

---

## Maintenance

### Ajouter un nouveau plan Stripe
1. Créez le prix dans Stripe Dashboard
2. Ajoutez le Price ID dans les variables d'environnement
3. Mettez à jour `PLANS` dans `lib/stripe.ts`
4. Redéployez sur Vercel

### Mettre à jour l'application EchoScribe
1. Remplacez `public/echoscribe-app.html` par la nouvelle version
2. Committez et poussez → Vercel redéploie automatiquement

### Monitorer les webhooks Stripe
Dashboard Stripe → **Developers → Webhooks** → cliquez sur votre endpoint

### Accéder aux logs Vercel
Vercel Dashboard → votre projet → **Functions** → sélectionnez une route API

---

## Architecture technique

```
/                          Landing page marketing
/login                     Authentification Supabase
/register                  Inscription + sélection plan
/forgot-password           Formulaire "mot de passe oublié"
/reset-password            Formulaire de saisie du nouveau mot de passe
/billing                   Gestion abonnement Stripe
/app                       Application EchoScribe (iframe)
/app/historique            Historique des comptes rendus
/app/parametres            Paramètres utilisateur
/admin                     Panel administration (table admins Supabase)

/api/auth/callback         Callback OAuth/email Supabase (échange PKCE server-side)
/api/auth/reset-password   Génère et envoie le token de réinitialisation (POST)
/api/auth/update-password  Vérifie le token HMAC et met à jour le mot de passe (POST)
/api/auth/session-init     Initialisation de session
/api/auth/force-signout    Déconnexion forcée

/api/stripe/checkout       Création session Checkout
/api/stripe/portal         Portail client Stripe
/api/stripe/webhook        Webhooks Stripe (events)

/api/relay/claude          Relay Claude (protège la clé API)
/api/relay/gemini          Relay Gemini avec fallback (timeout 5s)
/api/relay/openai          Relay OpenAI
/api/relay/groq            Relay Groq (llama-3.3-70b-versatile, timeout 3s)
/api/relay/whisper         Relay Whisper (transcription audio)
/api/relay/mistral         Relay Mistral

/mentions-legales          Mentions légales
/cgu                       CGU
/confidentialite           Politique de confidentialité
/public/echoscribe-app.html  App V5 HTML servie statiquement (embarquée en iframe dans /app)
```

### Flow authentification — Mot de passe oublié

```
[/forgot-password]
  → supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://echoscribe.fr/api/auth/callback?next=/reset-password"
    })
  → Supabase envoie l'email avec le lien de vérification

[Clic sur le lien email]
  → Supabase vérifie le token
  → Redirige vers /api/auth/callback?code=XXXX&next=/reset-password

[/api/auth/callback] (server-side)
  → exchangeCodeForSession(code)  ← échange PKCE côté serveur
  → Session établie dans les cookies SSR
  → Redirige vers /reset-password

[/reset-password]
  → supabase.auth.getSession()  ← session trouvée dans les cookies
  → Affiche le formulaire
  → supabase.auth.updateUser({ password })
  → Redirige vers /login
```

> **Pourquoi l'échange se fait server-side** : Supabase utilise PKCE par défaut. Le `code_verifier` est stocké dans les cookies du navigateur par `@supabase/ssr`. En faisant l'échange dans `/api/auth/callback` (route serveur), le verifier est disponible. Si l'utilisateur ouvre le lien dans un navigateur différent (ex: webview Gmail mobile), les cookies ne sont pas partagés et l'échange échoue.

### Chaîne de fallback IA (relays)

```
Groq llama-3.3-70b (3s timeout)
  ↓ échec
Gemini Flash (5s timeout)
  ↓ échec
OpenAI GPT-4
```

### Accès admin
L'accès à `/admin` est contrôlé par la table `admins` dans Supabase (pas par variable d'environnement). La variable `ADMIN_EMAILS` sert uniquement à bypasser la vérification d'abonnement pour l'accès à `/app`.

## Support

Pour tout problème technique : contact@echoscribe.fr

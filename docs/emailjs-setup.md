# Formulaire de contact : configuration EmailJS (≈ 10 min)

Le formulaire du site envoie **deux e-mails** à chaque message, sans back-end :

1. **à toi**, avec le message du visiteur (tu peux répondre directement, le « Répondre à » est l’adresse du visiteur) ;
2. **au visiteur**, un accusé de réception dans la langue qu’il utilisait sur le site.

Offre gratuite d’EmailJS : 200 e-mails par mois, donc environ 100 messages, puisque chaque message envoie 2 e-mails.

---

## 1. Créer le compte

1. Va sur <https://www.emailjs.com> → **Sign Up** (gratuit).
2. Confirme ton adresse e-mail.

## 2. Connecter ta boîte Gmail (« Email Service »)

1. Menu **Email Services** → **Add New Service** → **Gmail**.
2. **Connect Account**, choisis `nguiranebabacar305@gmail.com` et accepte l’autorisation d’envoi.
3. **Create Service**, puis note le **Service ID** (ex. `service_ab12cd3`).

## 3. Modèle n°1 : le message qui t’est envoyé

Menu **Email Templates** → **Create New Template**.

Onglet **Settings** :

| Champ | Valeur |
|---|---|
| Template name | `Portfolio – message reçu` |
| Subject | `{{owner_subject}}` |
| To Email | `nguiranebabacar305@gmail.com` |
| From Name | `Portfolio bndigit` |
| Reply To | `{{email}}` |

Onglet **Content** : clique sur **Edit Content** → **Code Editor** et colle le code suivant :

```html
<div style="font-family: Arial, sans-serif; background: #f5ebd0; padding: 24px; color: #000">
  <div style="max-width: 560px; margin: 0 auto; background: #fbf5e6; border: 1px solid #dfbfae; border-radius: 20px; padding: 28px">
    <p style="margin: 0 0 4px; color: #7f011f; font-weight: bold">Nouveau message depuis le portfolio</p>
    <h2 style="margin: 0 0 20px; color: #2b2f38">{{name}}</h2>
    <p style="margin: 0 0 6px"><strong>E-mail :</strong> {{email}}</p>
    <p style="margin: 0 0 6px"><strong>Sujet :</strong> {{subject}}</p>
    <p style="margin: 0 0 18px"><strong>Langue du site :</strong> {{language}}</p>
    <div style="white-space: pre-line; background: #f5ebd0; border-radius: 14px; padding: 16px; line-height: 1.6">{{message}}</div>
    <p style="margin: 20px 0 0; font-size: 13px; color: #6e5d58">Réponds simplement à cet e-mail pour écrire à {{name}}.</p>
  </div>
</div>
```

**Save**, puis note le **Template ID** (ex. `template_x1y2z3`).

## 4. Modèle n°2 : l’accusé de réception au visiteur

**Create New Template** une seconde fois.

Onglet **Settings** :

| Champ | Valeur |
|---|---|
| Template name | `Portfolio – accusé de réception` |
| Subject | `{{reply_subject}}` |
| To Email | `{{email}}` |
| From Name | `Serigne Khalifa Ababacar Sy Nguirane` |
| Reply To | `nguiranebabacar305@gmail.com` |

Onglet **Content**, dans le **Code Editor** :

```html
<div style="font-family: Arial, sans-serif; background: #f5ebd0; padding: 24px; color: #000">
  <div style="max-width: 560px; margin: 0 auto; background: #fbf5e6; border: 1px solid #dfbfae; border-radius: 20px; padding: 28px">
    <p style="margin: 0 0 18px; font-size: 20px; font-weight: bold">
      <span style="color: #1b3626">bn</span><span style="color: #7f011f">digit</span>
    </p>
    <div style="white-space: pre-line; line-height: 1.65">{{reply_message}}</div>
  </div>
</div>
```

`{{reply_message}}` contient déjà le texte complet (« Bonjour …, merci pour votre message … ») dans la langue du visiteur. Il se modifie dans `contact.mail.autoresponse` de `src/assets/i18n/fr.json` et `en.json`.

**Save**, puis note ce second **Template ID**.

## 5. Récupérer la clé publique

Menu **Account** → **General** → **Public Key**, à noter (ex. `AbCdEfGh123456789`).

## 6. Brancher le site

Dans `src/app/core/constants/contact.ts`, remplis :

```ts
export const EMAILJS_CONFIG: EmailJsConfig = {
  publicKey: 'AbCdEfGh123456789',      // étape 5
  serviceId: 'service_ab12cd3',        // étape 2
  ownerTemplateId: 'template_x1y2z3',  // étape 3
  autoReplyTemplateId: 'template_...', // étape 4
};
```

Ces valeurs sont **publiques par conception** : on peut les laisser dans le code du site sans risque. Ton adresse e-mail, elle, n’apparaît que dans EmailJS, pas dans le site.

## 7. Sécuriser (après la mise en ligne)

Menu **Account** → **Security** :

- **Allowed origins** : ajoute l’adresse du site en ligne (ex. `https://bndigit.com`). Seul ton site pourra alors envoyer avec ta clé. Garde `http://localhost:4200` si tu veux continuer à tester en local.
- Option : active une limite d’envoi (**Rate limit**, 1 envoi toutes les 10 s par exemple).

## Dépannage

- Le formulaire affiche « L’envoi a échoué » : ouvre la console du navigateur (F12). La vraie cause y est affichée (`[Contact] Sending failed: EmailJS 400: …`). Par exemple, `The Public Key is invalid` signifie qu’il faut revérifier l’étape 6.
- Le message « not configured » signifie que `EMAILJS_CONFIG` est encore vide.
- Le mail n’arrive pas : regarde les **spams** la première fois, et l’onglet **Email History** d’EmailJS.

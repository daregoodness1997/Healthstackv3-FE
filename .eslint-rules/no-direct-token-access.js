/**
 * ESLint Custom Rule: No Direct Token Access
 *
 * Prevents direct localStorage access for JWT tokens
 * Use secureStorage.getToken() instead
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow direct localStorage access for JWT tokens',
      category: 'Security',
      recommended: true,
    },
    messages: {
      noDirectTokenAccess:
        'Direct localStorage.getItem("feathers-jwt") is prohibited for security reasons. ' +
        'Use secureStorage.getToken() from utils/secureStorage instead.',
      noManualBearerToken:
        'Manual Authorization Bearer token headers are prohibited. ' +
        'Use uploadFile() from utils/secureHttp or Feathers client instead.',
    },
    schema: [],
  },

  create(context) {
    return {
      // Detect localStorage.getItem("feathers-jwt")
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.name === 'localStorage' &&
          node.callee.property.name === 'getItem' &&
          node.arguments.length > 0 &&
          node.arguments[0].value === 'feathers-jwt'
        ) {
          context.report({
            node,
            messageId: 'noDirectTokenAccess',
          });
        }
      },

      // Detect Authorization: `Bearer ${token}` patterns
      Property(node) {
        if (
          node.key.name === 'Authorization' &&
          node.value.type === 'TemplateLiteral' &&
          node.value.quasis.some((q) => q.value.raw.includes('Bearer'))
        ) {
          context.report({
            node,
            messageId: 'noManualBearerToken',
          });
        }
      },
    };
  },
};

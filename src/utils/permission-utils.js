export const treeProps = {
  children: 'permission',
  label: 'name'
}

export const isOkResult = (res) => res?.result === 'ok'

export const asArray = (value) => (Array.isArray(value) ? value : [])

export const deepClone = (value) => JSON.parse(JSON.stringify(value || []))

export const accessItemsToCheckedKeys = (items) => asArray(items).flatMap(item =>
  asArray(item.access).map(action => `${item.resource}:${action}`)
)

export const buildPermissionPayload = (features, checkedLeafKeys) => {
  const checkedSet = new Set(asArray(checkedLeafKeys))
  const payload = asArray(features).map(feature => {
    const resourceKey = feature.key
    const permission = asArray(feature.permission)
      .map(item => item.key)
      .filter(key => checkedSet.has(key))
      .map(key => String(key).split(':')[1])

    return {
      key: resourceKey,
      permission
    }
  })

  return JSON.stringify(payload)
}

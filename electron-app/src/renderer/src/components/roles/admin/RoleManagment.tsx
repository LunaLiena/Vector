import { Button, Text, Card, Checkbox, Modal, Box, TextInput } from '@gravity-ui/uikit'
import { useState, useEffect } from 'react'
import { RoleForm } from '@shared/RoleForm'
import api from '@api/api'
import { Route } from '@api-types/route'
import { Role } from '@api-types/role'
import { Stack } from './admin-components/stack'
import { BaseModalForm } from '@shared/BaseModalForm'
import { motion } from 'framer-motion'
interface ModalWindowProps {
  routes: Route[]
  role: Role
  onClose: () => void
}

const PermissionsModal = ({ routes, role, onClose }: ModalWindowProps) => {
  const allowedRoutes = routes.filter((route) => role.routes?.some((r) => r.id === route.id))

  return (
    <BaseModalForm title={`Разрешения для роли: ${role.name}`} onClose={onClose} width={600}>
      <Box style={{ padding: 8 }}>
        {allowedRoutes.length > 0 ? (
          <>
            <div
              style={{
                maxHeight: '60vh',
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 12,
                marginBottom: 16,
                padding: 8
              }}
            >
              {allowedRoutes.map((route) => (
                <Card
                  key={route.id}
                  view="outlined"
                  style={{
                    padding: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <Checkbox checked={true} disabled size="l" />
                  <Stack gap={2}>
                    <Text variant="subheader-2">{route.name}</Text>
                    {route.description && (
                      <Text color="secondary" variant="body-2">
                        {route.description}
                      </Text>
                    )}
                  </Stack>
                </Card>
              ))}
            </div>
            <Text
              variant="body-2"
              color="secondary"
              style={{
                textAlign: 'center',
                marginTop: 8
              }}
            >
              Всего разрешений: {allowedRoutes.length} из {routes.length}
            </Text>
          </>
        ) : (
          <Card
            view="outlined"
            style={{
              padding: 16,
              textAlign: 'center',
              backgroundColor: 'var(--g-color-base-float)'
            }}
          >
            <Text variant="subheader-2" color="secondary">
              У этой роли нет разрешений
            </Text>
          </Card>
        )}

        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '16px',
            justifyContent: 'flex-end'
          }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button view="outlined" type="button" onClick={onClose} size="l" width="max">
              Закрыть
            </Button>
          </motion.div>
        </div>
      </Box>
    </BaseModalForm>
  )
}

export const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [rolesResponse, routesResponse] = await Promise.all([
        api.get<Role[]>('/roles'),
        api.get<Route[]>('/routes')
      ])
      setRoles(rolesResponse.data || [])
      setRoutes(routesResponse.data || [])
    } catch (error) {
      console.error('Error:', error)
      setError('Ошибка загрузки данных')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (roleId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту роль?')) return

    try {
      setIsLoading(true)
      await api.delete(`/roles/${roleId}`)
      await fetchData()
    } catch (error) {
      console.error('Error deleting role:', error)
      setError('Ошибка удаления роли')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShowPermissions = (role: Role) => {
    setSelectedRole(role)
    setShowPermissionsModal(true)
  }

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{ height: '100%' }}>
      <Card
        view="raised"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Фиксированная верхняя часть */}
        <div style={{ padding: 16, flexShrink: 0 }}>
          <Text variant="header-2">Управление ролями</Text>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <TextInput
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flexGrow: 1, marginTop: 12 }}
            />
            <Button
              view="action"
              onClick={() => {
                setEditingRole(null)
                setShowForm(true)
              }}
              style={{ marginTop: 12 }}
              loading={isLoading}
            >
              Создать новую роль
            </Button>
          </div>
        </div>

        {/* Прокручиваемая область с карточками */}
        <div
          style={{
            flexGrow: 1,
            overflowY: 'auto',
            padding: '0 16px 16px'
          }}
        >
          {isLoading ? (
            <Text>Загрузка данных...</Text>
          ) : error ? (
            <Text color="danger">{error}</Text>
          ) : filteredRoles.length === 0 ? (
            <Text>Роли не найдены</Text>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {filteredRoles.map((role) => (
                <Card key={role.id} view="outlined" style={{ padding: 12 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Stack gap={2}>
                      <Text variant="subheader-2">{role.name}</Text>
                      {role.description && <Text color="secondary">{role.description}</Text>}
                    </Stack>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button
                        view="outlined"
                        size="m"
                        onClick={() => handleShowPermissions(role)}
                        disabled={isLoading}
                      >
                        Разрешения
                      </Button>
                      <Button
                        view="outlined"
                        size="m"
                        onClick={() => {
                          setEditingRole(role)
                          setShowForm(true)
                        }}
                      >
                        Редактировать
                      </Button>
                      <Button
                        view="outlined-danger"
                        size="m"
                        onClick={() => handleDelete(role.id)}
                        loading={isLoading}
                      >
                        Удалить
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      {showForm && (
        <RoleForm
          role={editingRole}
          routes={routes}
          onClose={() => {
            setShowForm(false)
            setEditingRole(null)
          }}
          onSuccess={() => {
            fetchData()
            setShowForm(false)
          }}
        />
      )}

      {showPermissionsModal && selectedRole && (
        <Modal open={true} onOpenChange={() => setShowPermissionsModal(false)}>
          <Card view="raised" style={{ width: 600, maxWidth: '90vw', padding: 16 }}>
            <PermissionsModal
              routes={routes}
              role={selectedRole}
              onClose={() => setShowPermissionsModal(false)}
            />
          </Card>
        </Modal>
      )}
    </div>
  )
}

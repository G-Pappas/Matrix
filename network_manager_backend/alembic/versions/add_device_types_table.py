"""add device types table

Revision ID: add_device_types_table
Revises: 09baec5d34bf
Create Date: 2024-03-19 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_device_types_table'
down_revision = '09baec5d34bf'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'device_types',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    op.create_index(op.f('ix_device_types_id'), 'device_types', ['id'], unique=False)

def downgrade():
    op.drop_index(op.f('ix_device_types_id'), table_name='device_types')
    op.drop_table('device_types') 
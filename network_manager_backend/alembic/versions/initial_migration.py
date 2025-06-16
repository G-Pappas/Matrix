"""initial migration

Revision ID: initial_migration
Revises: 
Create Date: 2024-03-19 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'initial_migration'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add tags column to existing devices table
    op.add_column('devices', sa.Column('tags', sa.ARRAY(sa.String()), nullable=False, server_default='{}'))


def downgrade() -> None:
    # Remove tags column from devices table
    op.drop_column('devices', 'tags') 
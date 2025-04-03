"""create accounts table

Revision ID: 7683ab8c0435
Revises: 
Create Date: 2025-04-03 09:25:33.978358

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7683ab8c0435'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    accounts_table = op.create_table(
        'account',
        sa.Column('id', sa.Integer()),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('description', sa.VARCHAR(200)),
        sa.Column('last_transaction_date', sa.DateTime()),
        sa.PrimaryKeyConstraint('id')
    )
    op.bulk_insert(
        accounts_table,
        [
            {'id': 1, 'name': 'John', 'description': 'Description 1'},
            {'id': 2, 'name': 'Bob', 'description': 'Description 2'},
            {'id': 3, 'name': 'Jane', 'description': 'Description 3'},
        ]
    )

def downgrade():
    op.drop_table("account")

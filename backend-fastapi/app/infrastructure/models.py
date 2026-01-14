from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Prueba(Base):
    __tablename__ = "prueba"

    id_prueba: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )
    description: Mapped[str]
